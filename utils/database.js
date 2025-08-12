import bcrypt from 'bcryptjs';

// Hash password for superuser (password: 'superuser')
const superuserPasswordHash = bcrypt.hashSync('superuser', 10);

// Mock database menggunakan array
let users = [
  {
    id: 1,
    username: 'superuser',
    password: superuserPasswordHash,
    role: 'admin',
    email: 'superuser@admin.com'
  }
];

let foods = [
  { id: 1, name: 'Nasi Goreng', price: 25000, description: 'Nasi goreng spesial dengan telur' },
  { id: 2, name: 'Mie Ayam', price: 20000, description: 'Mie ayam dengan pangsit' }
];

let drinks = [
  { id: 1, name: 'Es Teh', price: 5000, description: 'Es teh manis segar' },
  { id: 2, name: 'Jus Jeruk', price: 12000, description: 'Jus jeruk segar tanpa gula' }
];

let announcements = [
  { 
    id: 1, 
    title: 'Selamat Datang di CRUD App!', 
    content: 'Aplikasi ini dibuat untuk pembelajaran API testing dengan fitur lengkap CRUD operations.', 
    date: new Date().toISOString() 
  },
  { 
    id: 2, 
    title: 'Panduan Penggunaan', 
    content: 'Login dengan superuser/superuser untuk akses admin. User biasa bisa mendaftar melalui halaman register.', 
    date: new Date().toISOString() 
  }
];

// Auto-increment ID generator
let nextUserId = 2;
let nextFoodId = 3;
let nextDrinkId = 3;

export const db = {
  users: {
    getAll: () => users,
    getById: (id) => users.find(u => u.id === parseInt(id)),
    getByUsername: (username) => users.find(u => u.username === username),
    create: (user) => {
      const newUser = { ...user, id: nextUserId++, role: 'user' };
      users.push(newUser);
      return newUser;
    },
    update: (id, userData) => {
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1) {
        users[index] = { ...users[index], ...userData };
        return users[index];
      }
      return null;
    },
    delete: (id) => {
      const index = users.findIndex(u => u.id === parseInt(id));
      if (index !== -1 && users[index].username !== 'superuser') {
        users.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  foods: {
    getAll: () => foods,
    getById: (id) => foods.find(f => f.id === parseInt(id)),
    create: (food) => {
      const newFood = { ...food, id: nextFoodId++ };
      foods.push(newFood);
      return newFood;
    },
    update: (id, foodData) => {
      const index = foods.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        foods[index] = { ...foods[index], ...foodData };
        return foods[index];
      }
      return null;
    },
    delete: (id) => {
      const index = foods.findIndex(f => f.id === parseInt(id));
      if (index !== -1) {
        foods.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  drinks: {
    getAll: () => drinks,
    getById: (id) => drinks.find(d => d.id === parseInt(id)),
    create: (drink) => {
      const newDrink = { ...drink, id: nextDrinkId++ };
      drinks.push(newDrink);
      return newDrink;
    },
    update: (id, drinkData) => {
      const index = drinks.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        drinks[index] = { ...drinks[index], ...drinkData };
        return drinks[index];
      }
      return null;
    },
    delete: (id) => {
      const index = drinks.findIndex(d => d.id === parseInt(id));
      if (index !== -1) {
        drinks.splice(index, 1);
        return true;
      }
      return false;
    }
  },
  announcements: {
    getAll: () => announcements
  }
};