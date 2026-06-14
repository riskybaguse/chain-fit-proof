import { createContext, useContext, useEffect, useState, ReactNode, useMemo} from "react";

export interface Exercise {
    id: number;
    name: string;
    sets: string;
    reps: string;
    weight: string;
  }

// Struktur data 1 sesi latihan
export type Workout = {
  id: string;
  date: string;
  type: string;
  duration: string;
  exercises: Exercise[];
  txHash: string;
  status: "Verified";
};

type WorkoutContextType = {
  workouts: Workout[];
  streak: number;
  totalVolume: string;
  totalVolumeKg: number;
  totalWorkouts: number;
  addWorkout: (w: Omit<Workout, "id" | "txHash" | "status">) => void;
};

// Data dummy awal biar dashboard lo tetep seksi pas pertama kali dibuka
const initialWorkouts: Workout[] = [
    { id: "1", date: "2026-04-27", type: "PUSH", duration: "62", exercises: [{ id: 1, name: "Bench Press", sets: "4", reps: "8", weight: "80" }], txHash: "7xKm9pQrAv3Z", status: "Verified" },
    { id: "2", date: "2026-04-26", type: "PULL", duration: "58", exercises: [{ id: 2, name: "Pull Up", sets: "4", reps: "8", weight: "0" }], txHash: "4hN2vBcL8mQs", status: "Verified" },
    { id: "3", date: "2026-04-25", type: "LEG", duration: "71", exercises: [{ id: 3, name: "Squat", sets: "5", reps: "5", weight: "100" }], txHash: "9aZ3kRpW1nDe", status: "Verified" },
];

const WorkoutCtx = createContext<WorkoutContextType | null>(null);

export const WorkoutProvider = ({ children }: { children: ReactNode }) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [streak, setStreak] = useState(167);
  const [totalWorkouts, setTotalWorkouts] = useState(234);

  // Penghitung Total Volume Otomatis
  const { formatted: dynamicTotalVolume, rawKg: totalVolumeKg } = useMemo(() => {
    let total = 0;
    
    workouts.forEach((w) => {
      if (w.exercises && Array.isArray(w.exercises)) {
        w.exercises.forEach((ex) => {
          const sets = parseInt(ex.sets) || 0;
          const reps = parseInt(ex.reps) || 0;
          const weight = parseFloat(ex.weight) || 0;
          total += sets * reps * weight;
        });
      }
    });

    return {
      formatted: total.toLocaleString("en-US"),
      rawKg: total,
    };
  }, [workouts]);

  // Pas aplikasi diload, cek apakah udah ada data di memori browser
  useEffect(() => {
    const stored = localStorage.getItem("gainchain.workouts.v1");
    if (stored) {
      const parsed = JSON.parse(stored);
      setWorkouts(parsed.workouts);
      setStreak(parsed.streak);
      setTotalWorkouts(parsed.totalWorkouts);
    } else {
      setWorkouts(initialWorkouts); // Kalo kosong, masukin data dummy
    }
  }, []);

  // Fungsi sakti buat nambahin latihan baru!
  const addWorkout = (w: Omit<Workout, "id" | "txHash" | "status">) => {
    // KUNCI UTAMA: Paksa ambil tanggal live dari sistem HARI INI
    const liveDate = new Date().toISOString().slice(0, 10);

    // Generate TX Hash bohongan ala Solana (huruf dan angka acak)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let mockTx = "";
    for (let i = 0; i < 12; i++) mockTx += chars.charAt(Math.floor(Math.random() * chars.length));

    const newWorkout: Workout = {
      ...w,
      date: liveDate, // PAKSA TIMPA TANGGAL DARI FORM PAKE TANGGAL LIVE!
      id: Date.now().toString(),
      txHash: mockTx,
      status: "Verified",
    };

    // LOGIKA ANTI-SPAM & PENGHITUNG STREAK
    let newStreak = streak;
    
    if (workouts.length > 0) {
      // Ambil tanggal dari latihan terbaru di history
      const lastWorkoutDate = workouts[0].date;

      if (lastWorkoutDate !== liveDate) {
        // Cuma nambah kalo tanggal terakhir BEDA sama tanggal live HARI INI
        newStreak = streak + 1;
      }
    } else {
      newStreak = 1;
    }

    const updatedWorkouts = [newWorkout, ...workouts];
    const newTotal = totalWorkouts + 1;

    // Update State
    setWorkouts(updatedWorkouts);
    setStreak(newStreak);
    setTotalWorkouts(newTotal);

    // Simpan permanen di Local Storage browser
    localStorage.setItem(
      "gainchain.workouts.v1",
      JSON.stringify({ workouts: updatedWorkouts, streak: newStreak, totalWorkouts: newTotal })
    );
  };
  

  return (
    <WorkoutCtx.Provider value={{ workouts, streak, totalWorkouts, totalVolume: dynamicTotalVolume, totalVolumeKg, addWorkout }}>
      {children}
    </WorkoutCtx.Provider>
  );
};

export const useWorkout = () => {
  const context = useContext(WorkoutCtx);
  if (!context) throw new Error("useWorkout must be used within WorkoutProvider");
  return context;
};