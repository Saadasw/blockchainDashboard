const fs = require('fs');
const path = require('path');

// Read the env.example file
const envExamplePath = path.join(__dirname, 'env.example');
const envPath = path.join(__dirname, 'backend', '.env');

try {
  const envExampleContent = fs.readFileSync(envExamplePath, 'utf8');
  
  // Replace the Etherscan API key placeholder with the actual key
  const envContent = envExampleContent.replace(
    'ETHERSCAN_API_KEY=your_etherscan_api_key_here',
    'ETHERSCAN_API_KEY=6EXCVEPB1KF672UWNDNFH4WAJH1RXV7IFV'
  );
  
  // Write the .env file
  fs.writeFileSync(envPath, envContent);
  
  console.log('✅ Environment file created successfully!');
  console.log('📁 Location: backend/.env');
  console.log('🔑 Etherscan API key configured');
  console.log('');
  console.log('You can now start the application with: npm run dev');
  
} catch (error) {
  console.error('❌ Error creating environment file:', error.message);
  console.log('');
  console.log('Please manually create a .env file in the backend directory with:');
  console.log('ETHERSCAN_API_KEY=6EXCVEPB1KF672UWNDNFH4WAJH1RXV7IFV');
}

