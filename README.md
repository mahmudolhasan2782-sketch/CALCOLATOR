
# Modern Scientific Calculator by Hemontu Inco.

A fully functional, multicolor, and dynamic scientific calculator built with React, TypeScript, and Tailwind CSS.

## Features

- **Dual Modes:** Scientific & Programmer
- **Scientific Functions:** Trigonometry (sin, cos, tan), Logarithms, Exponents, Roots
- **Programmer Functions:** HEX/DEC/OCT/BIN conversion, Logic Gates (AND, OR, XOR, NOT)
- **Memory Functions:** M+, M-, MR, MC
- **Dynamic UI:** Multicolor buttons and responsive design
- **No External APIs:** 100% Client-side execution

## Deployment

This project is optimized for deployment on Vercel.

1. Push to GitHub.
2. Import project in Vercel.
3. Framework Preset: **Vite**
4. Deploy!

## 📱 Android APK Generation (Zero-Cost)

আপনি এই প্রজেক্টটিকে বিনামূল্যে Android APK-তে রূপান্তর করতে নিচের ধাপগুলো অনুসরণ করুন (Capacitor ব্যবহার করে):

### ১. সেটআপ এবং ইনস্টলেশন
আপনার টার্মিনালে নিচের কমান্ডগুলো রান করুন:

```bash
# Capacitor ডিপেন্ডেন্সি ইনস্টল করুন
npm install @capacitor/core @capacitor/cli @capacitor/android

# Android প্ল্যাটফর্ম যুক্ত করুন
npx cap add android
```

### ২. বিল্ড এবং সিঙ্ক
অ্যাপটি বিল্ড করে অ্যান্ড্রয়েড ফোল্ডারের সাথে সিঙ্ক করুন:

```bash
# প্রোডাকশন বিল্ড তৈরি করুন
npm run build

# ফাইল সিঙ্ক করুন
npx cap sync
```

### ৩. APK তৈরি (Android Studio)
নিচের কমান্ডটি দিলে Android Studio ওপেন হবে:

```bash
npx cap open android
```

এরপর Android Studio থেকে:
1. `Build` মেনুতে যান।
2. `Generate Signed Bundle / APK...` সিলেক্ট করুন।
3. `APK` সিলেক্ট করে `Next` দিন।
4. একটি নতুন Key Store তৈরি করুন (বিনামূল্যে)।
5. `release` মোড সিলেক্ট করে `Finish` দিন।

ব্যাস! আপনার অ্যাপ এখন মোবাইলে ইন্সটল করার জন্য প্রস্তুত।

---
Developed by **Hemontu Incorporation**
