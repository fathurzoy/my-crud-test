import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

// Path untuk menyimpan data JSON
const DATA_DIR = path.join(process.cwd(), 'data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const FOODS_FILE = path.join(DATA_DIR, 'foods.json');
const DRINKS_FILE = path.join(DATA_DIR, 'drinks.json');
const ANNOUNCEMENTS_FILE = path.join(DATA_DIR, 'announcements.json');
const COUNTERS_FILE = path.join(DATA_DIR, 'counters.json');

// Buat folder data jika belum ada
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Helper functions untuk read/write JSON
const readJSONFile = (filePath, defaultValue = []) => {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
  }
  return defaultValue;
};

const writeJSONFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
};

// Initialize default data
const initializeData = () => {
  // Initialize users
  if (!fs.existsSync(USERS_FILE)) {
    const superuserPasswordHash = bcrypt.hashSync('superuser', 10);
    const defaultUsers = [
      {
        id: 1,
        username: 'superuser',
        password: superuserPasswordHash,
        role: 'admin',
        email: 'superuser@admin.com'
      }
    ];
    writeJSONFile(USERS_FILE, defaultUsers);
  }

  // Initialize foods
  if (!fs.existsSync(FOODS_FILE)) {
    const defaultFoods = [
      { id: 1, name: 'Nasi Goreng', price: 25000, description: 'Nasi goreng spesial dengan telur' },
      { id: 2, name: 'Mie Ayam', price: 20000, description: 'Mie ayam dengan pangsit' }
    ];
    writeJSONFile(FOODS_FILE, defaultFoods);
  }

  // Initialize drinks
  if (!fs.existsSync(DRINKS_FILE)) {
    const defaultDrinks = [
      { id: 1, name: 'Es Teh', price: 5000, description: 'Es teh manis segar' },
      { id: 2, name: 'Jus Jeruk', price: 12000, description: 'Jus jeruk segar tanpa gula' }
    ];
    writeJSONFile(DRINKS_FILE, defaultDrinks);
  }

  // Initialize announcements
  if (!fs.existsSync(ANNOUNCEMENTS_FILE)) {
    const defaultAnnouncements = [
      { 
        id: 1, 
        title: 'Selamat Datang di CRUD App!', 
        content: 'Aplikasi ini dibuat untuk pembelajaran API testing dengan fitur lengkap CRUD operations.', 
        date: new Date().toISOString() 
      },
      { 
        id: 2, 
        title: 'Data Persistent', 
        content: 'Sekarang data akan tersimpan di file JSON dan tidak akan hilang saat refresh!', 
        date: new Date().toISOString() 
      }
    ];
    writeJSONFile(ANNOUNCEMENTS_FILE, defaultAnnouncements);
  }

  // Initialize counters for auto-increment IDs
  if (!fs.existsSync(COUNTERS_FILE)) {
    const defaultCounters = {
      nextUserId: 2,
      nextFoodId: 3,
      nextDrinkId: 3,
      nextAnnouncementId: 3
    };
    writeJSONFile(COUNTERS_FILE, defaultCounters);
  }
};

// Initialize data on first load
initializeData();

// Counter management
const getCounters = () => readJSONFile(COUNTERS_FILE, { nextUserId: 2, nextFoodId: 3, nextDrinkId: 3, nextAnnouncementId: 3 });
const updateCounters = (counters) => writeJSONFile(COUNTERS_FILE, counters);

const getNextId = (counterName) => {
  const counters = getCounters();
  const nextId = counters[counterName] || 1;
  counters[counterName] = nextId + 1;
  updateCounters(counters);
  return nextId;
};

export const db = {
  users: {
    getAll: () => {
      return readJSONFile(USERS_FILE, []);
    },
    
    getById: (id) => {
      const users = readJSONFile(USERS_FILE, []);
      return users.find(u => u.id === parseInt(id));
    },
    
    getByUsername: (username) => {
      const users = readJSONFile(USERS_FILE, []);
      return users.find(u => u.username === username);
    },
    
    create: (user) => {
      const users = readJSONFile(USERS_FILE, []);
      const newUser = { 
        ...user, 
        id: getNextId('nextUserId'), 
        role: user.role || 'user' 
      };
      users.push(newUser);
      writeJSONFile(USERS_FILE, users);
      return newUser;
    },
    
    update: (id, userData) => {
      const users = readJSONFile(USERS_FILE, []);
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        writeJSONFile(USERS_FILE, users);
        return users[index];
      }
      return null;
    },
    
    delete: (id) => {
      const users = readJSONFile(USERS_FILE, []);
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1 && users[index].username !== 'superuser') {
        users.splice(index, 1);
        writeJSONFile(USERS_FILE, users);
        return true;
      }
      return false;
    }
  },

  foods: {
    getAll: () => {
      return readJSONFile(FOODS_FILE, []);
    },
    
    getById: (id) => {
      const foods = readJSONFile(FOODS_FILE, []);
      return foods.find(f => f.id === parseInt(id));
    },
    
    create: (food) => {
      const foods = readJSONFile(FOODS_FILE, []);
      const newFood = { 
        ...food, 
        id: getNextId('nextFoodId'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      foods.push(newFood);
      writeJSONFile(FOODS_FILE, foods);
      return newFood;
    },
    
    update: (id, foodData) => {
      const foods = readJSONFile(FOODS_FILE, []);
      const index = foods.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        foods[index] = { 
          ...foods[index], 
          ...foodData,
          updatedAt: new Date().toISOString()
        };
        writeJSONFile(FOODS_FILE, foods);
        return foods[index];
      }
      return null;
    },
    
    delete: (id) => {
      const foods = readJSONFile(FOODS_FILE, []);
      const index = foods.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        foods.splice(index, 1);
        writeJSONFile(FOODS_FILE, foods);
        return true;
      }
      return false;
    }
  },

  drinks: {
    getAll: () => {
      return readJSONFile(DRINKS_FILE, []);
    },
    
    getById: (id) => {
      const drinks = readJSONFile(DRINKS_FILE, []);
      return drinks.find(d => d.id === parseInt(id));
    },
    
    create: (drink) => {
      const drinks = readJSONFile(DRINKS_FILE, []);
      const newDrink = { 
        ...drink, 
        id: getNextId('nextDrinkId'),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      drinks.push(newDrink);
      writeJSONFile(DRINKS_FILE, drinks);
      return newDrink;
    },
    
    update: (id, drinkData) => {
      const drinks = readJSONFile(DRINKS_FILE, []);
      const index = drinks.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        drinks[index] = { 
          ...drinks[index], 
          ...drinkData,
          updatedAt: new Date().toISOString()
        };
        writeJSONFile(DRINKS_FILE, drinks);
        return drinks[index];
      }
      return null;
    },
    
    delete: (id) => {
      const drinks = readJSONFile(DRINKS_FILE, []);
      const index = drinks.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        drinks.splice(index, 1);
        writeJSONFile(DRINKS_FILE, drinks);
        return true;
      }
      return false;
    }
  },

  announcements: {
    getAll: () => {
      return readJSONFile(ANNOUNCEMENTS_FILE, []);
    },
    
    create: (announcement) => {
      const announcements = readJSONFile(ANNOUNCEMENTS_FILE, []);
      const newAnnouncement = { 
        ...announcement, 
        id: getNextId('nextAnnouncementId'),
        date: new Date().toISOString()
      };
      announcements.push(newAnnouncement);
      writeJSONFile(ANNOUNCEMENTS_FILE, announcements);
      return newAnnouncement;
    }
  },

  // Utility functions
  resetData: () => {
    // Hapus semua file data untuk reset
    [USERS_FILE, FOODS_FILE, DRINKS_FILE, ANNOUNCEMENTS_FILE, COUNTERS_FILE].forEach(file => {
      if (fs.existsSync(file)) {
        fs.unlinkSync(file);
      }
    });
    // Re-initialize dengan data default
    initializeData();
  },

  backup: () => {
    // Buat backup semua data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(DATA_DIR, 'backups', timestamp);
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }

    [USERS_FILE, FOODS_FILE, DRINKS_FILE, ANNOUNCEMENTS_FILE, COUNTERS_FILE].forEach(file => {
      if (fs.existsSync(file)) {
        const fileName = path.basename(file);
        fs.copyFileSync(file, path.join(backupDir, fileName));
      }
    });

    return backupDir;
  }
};