import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';
import dotenv   from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../.env') });

import User from '../models/model/User.js';

const DEMO_USER = {
  username: 'Lector Demo',
  email: 'demo@bookwise.com',
  password: 'Demo1234!',
  role: 'user',
};

const DEMO_ADMIN = {
  username: 'Admin Demo',
  email: 'admin-demo@bookwise.com',
  password: 'Demo1234!',
  role: 'admin',
};

const upsertDemoAccount = async ({ username, email, password, role }) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const existing = await User.findOne({ email });

  if (existing) {
    existing.username   = username;
    existing.password   = hashedPassword;
    existing.role       = role;
    existing.isVerified = true;
    existing.isDemo     = true;
    await existing.save();
    console.log(`♻️  Cuenta demo actualizada → ${email}`);
  } else {
    await User.create({
      username, email, password: hashedPassword, role,
      isVerified: true,
      isDemo: true,
    });
    console.log(`✨ Cuenta demo creada → ${email}`);
  }
};

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Conectado a MongoDB');
    await upsertDemoAccount(DEMO_USER);
    await upsertDemoAccount(DEMO_ADMIN);
    console.log('\n🎉 Cuentas demo listas\n');
  } catch (err) {
    console.error('❌ Error en seed de cuentas demo:', err.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Desconectado de MongoDB');
  }
};

seed();