import trainer1 from './assets/trainers/trainer_1_ahmed_1774184015116.png';
import trainer2 from './assets/trainers/trainer_2_sara_1774184231568.png';
import trainer3 from './assets/trainers/trainer_3_marcus_1774184341544.png';
import trainer4 from './assets/trainers/trainer_4_fatima_1774184492776.png';
import trainer5 from './assets/trainers/trainer_5_james_1774184514889.png';
import trainer6 from './assets/trainers/trainer_6_layla_1774184964133.png';

export const PROGRAMS = [
  { id: 1, title: "Weight Loss", icon: "🔥", desc: "Burn fat with personalized plans" },
  { id: 2, title: "Boxing & Kickboxing", icon: "🥊", desc: "Learn striking & build power" },
  { id: 3, title: "Muscle Toning", icon: "💪", desc: "Sculpt and define your physique" },
  { id: 4, title: "Rehabilitation", icon: "🩹", desc: "Recover stronger than before" },
  { id: 5, title: "Corporate Training", icon: "🏢", desc: "Team fitness & wellness" },
  { id: 6, title: "Pre/Postnatal", icon: "🤰", desc: "Safe training for mothers" },
  { id: 7, title: "Nutrition Coaching", icon: "🥗", desc: "Fuel your body right" },
  { id: 8, title: "Yoga & Pilates", icon: "🧘", desc: "Flexibility, balance & peace" },
  { id: 9, title: "Swimming", icon: "🏊", desc: "Aquatic fitness coaching" },
  { id: 10, title: "CrossFit", icon: "🏋️", desc: "High-intensity functional fitness" },
  { id: 11, title: "Dance", icon: "💃", desc: "Move to the rhythm & burn" },
  { id: 12, title: "Assisted Stretching", icon: "🤸", desc: "Improve mobility & recovery" },
];

export const TRAINERS = [
  { id: 1, name: "Ahmed Al-Rashid", spec: "Weight Loss & HIIT", exp: "8 years", price: 250, rating: 4.9, location: "Dubai Marina", bio: "Certified personal trainer specializing in high-intensity interval training and weight management. Former professional athlete with a passion for helping clients achieve sustainable results.", programs: ["Weight Loss", "CrossFit", "Nutrition Coaching"], reviews: 127, img: trainer1 },
  { id: 2, name: "Sara Mitchell", spec: "Yoga & Pilates", exp: "6 years", price: 200, rating: 4.8, location: "JBR", bio: "Internationally certified yoga instructor with expertise in Vinyasa, Hatha, and therapeutic yoga. Focused on mind-body connection and holistic wellness.", programs: ["Yoga & Pilates", "Assisted Stretching", "Pre/Postnatal"], reviews: 94, img: trainer2 },
  { id: 3, name: "Marcus Chen", spec: "Boxing & MMA", exp: "10 years", price: 300, rating: 5.0, location: "Downtown Dubai", bio: "Former competitive boxer turned elite fitness coach. Specializes in combat sports training and functional strength for fighters and enthusiasts alike.", programs: ["Boxing & Kickboxing", "Muscle Toning", "CrossFit"], reviews: 203, img: trainer3 },
  { id: 4, name: "Fatima Noor", spec: "Nutrition & Wellness", exp: "5 years", price: 180, rating: 4.7, location: "Online", bio: "Registered dietitian and wellness coach helping clients transform through evidence-based nutrition strategies and lifestyle modifications.", programs: ["Nutrition Coaching", "Weight Loss", "Corporate Training"], reviews: 76, img: trainer4 },
  { id: 5, name: "James Rodriguez", spec: "CrossFit & Strength", exp: "7 years", price: 280, rating: 4.9, location: "Business Bay", bio: "CrossFit L3 certified trainer with a background in Olympic weightlifting. Passionate about building raw strength and athletic performance.", programs: ["CrossFit", "Muscle Toning", "Rehabilitation"], reviews: 158, img: trainer5 },
  { id: 6, name: "Layla Hassan", spec: "Dance & Cardio", exp: "4 years", price: 160, rating: 4.6, location: "JLT", bio: "Professional dancer and certified fitness instructor specializing in dance-based cardio workouts. Makes fitness fun and accessible for everyone.", programs: ["Dance", "Weight Loss", "Corporate Training"], reviews: 62, img: trainer6 },
  { id: 7, name: "David Park", spec: "Swimming & Aquatics", exp: "12 years", price: 320, rating: 4.8, location: "Palm Jumeirah", bio: "Former national swim team member and aquatic fitness specialist. Offers stroke technique, water therapy, and aquatic endurance training.", programs: ["Swimming", "Rehabilitation", "Assisted Stretching"], reviews: 89, img: trainer1 },
  { id: 8, name: "Nina Volkov", spec: "Pre/Postnatal Fitness", exp: "9 years", price: 220, rating: 4.9, location: "Dubai Hills", bio: "Women's health specialist and pre/postnatal exercise expert. Certified by the American College of Sports Medicine with a focus on safe, effective training for mothers.", programs: ["Pre/Postnatal", "Yoga & Pilates", "Assisted Stretching"], reviews: 134, img: trainer2 },
  { id: 9, name: "Omar Khalil", spec: "Muscle Building", exp: "11 years", price: 290, rating: 4.8, location: "DIFC", bio: "Competitive bodybuilder and strength coach with over a decade of experience in hypertrophy training and physique development.", programs: ["Muscle Toning", "Nutrition Coaching", "CrossFit"], reviews: 171, img: trainer3 },
  { id: 10, name: "Emma Sterling", spec: "Corporate Wellness", exp: "6 years", price: 350, rating: 4.7, location: "Online", bio: "Corporate wellness consultant providing team fitness programs, stress management workshops, and workplace health initiatives for leading companies.", programs: ["Corporate Training", "Yoga & Pilates", "Nutrition Coaching"], reviews: 55, img: trainer4 },
];

export const PACKAGES = [
  { name: "Single Session", sessions: 1, discount: 0 },
  { name: "Starter Pack", sessions: 5, discount: 10 },
  { name: "Pro Pack", sessions: 10, discount: 15 },
  { name: "Elite Pack", sessions: 20, discount: 20 },
];
