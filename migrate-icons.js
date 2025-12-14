// migrate-icons.js
// Ejecuta: node migrate-icons.js

const fs = require('fs');
const path = require('path');

const iconMapping = {
  // Font Awesome
  'FaCaretDown': 'ChevronDown',
  'FaEdit': 'Pencil',
  'FaEye': 'Eye',
  'FaSearch': 'Search',
  'FaTrash': 'Trash2',
  'FaChartBar': 'BarChart3',
  'FaMoneyBill': 'DollarSign',
  'FaRegStar': 'Star',
  'FaStar': 'Star',
  'FaUsers': 'Users',
  'FaChartLine': 'TrendingUp',
  'FaProductHunt': 'Package',
  'FaCartShopping': 'ShoppingCart',
  'FaGear': 'Settings',
  'FaMessage': 'MessageSquare',
  'FaMoneyBillTrendUp': 'TrendingUp',
  'FaElementor': 'Layers',
  'FaFileInvoiceDollar': 'FileText',
  'FaUserPlus': 'UserPlus',
  
  // Ionicons
  'IoMdAdd': 'Plus',
  'IoMdClose': 'X',
  'IoMdRemove': 'Minus',
  
  // Ant Design
  'AiOutlineEye': 'Eye',
  'AiOutlineEdit': 'Pencil',
  'AiOutlineDelete': 'Trash2',
  
  // Hero Icons
  'HiUsers': 'Users',
  
  // Game Icons
  'GiPayMoney': 'Wallet',
  
  // VS Code Icons
  'VscServerEnvironment': 'Server',
  
  // Circle Icons
  'CiLocationOn': 'MapPin',
  'CiMoneyBill': 'DollarSign',
  'CiLogout': 'LogOut',
  
  // Tabler Icons
  'TbCategoryPlus': 'FolderPlus',
};

function migrateFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // Encontrar todas las importaciones de react-icons
  const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]react-icons\/[^'"]+['"];?/g;
  const matches = [...content.matchAll(importRegex)];

  if (matches.length === 0) return false;

  // Recolectar todos los íconos usados en este archivo
  const lucideIcons = new Set();
  
  matches.forEach(match => {
    const icons = match[1].split(',').map(i => i.trim());
    icons.forEach(icon => {
      if (iconMapping[icon]) {
        lucideIcons.add(iconMapping[icon]);
      }
    });
  });

  // Remover imports de react-icons
  content = content.replace(importRegex, '');

  // Agregar import de lucide-react al inicio
  if (lucideIcons.size > 0) {
    const lucideImport = `import { ${[...lucideIcons].join(', ')} } from 'lucide-react';\n`;
    
    // Encontrar la primera línea de import y agregar después
    const firstImportMatch = content.match(/^import\s/m);
    if (firstImportMatch) {
      const insertPos = firstImportMatch.index;
      content = content.slice(0, insertPos) + lucideImport + content.slice(insertPos);
    } else {
      content = lucideImport + content;
    }
    
    modified = true;
  }

  // Reemplazar uso de los íconos en el código
  Object.entries(iconMapping).forEach(([oldIcon, newIcon]) => {
    const regex = new RegExp(`<${oldIcon}\\b`, 'g');
    if (content.match(regex)) {
      content = content.replace(regex, `<${newIcon}`);
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  let count = 0;

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      count += walkDir(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      if (migrateFile(filePath)) {
        console.log(`✅ Migrado: ${filePath}`);
        count++;
      }
    }
  });

  return count;
}

console.log('🚀 Iniciando migración de react-icons a lucide-react...\n');
const totalMigrated = walkDir('./src');
console.log(`\n✨ Migración completada: ${totalMigrated} archivos modificados`);
console.log('\n⚠️  IMPORTANTE: Revisa los cambios antes de commit');
console.log('💡 Ejecuta: pnpm remove react-icons');