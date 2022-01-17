npx prisma generate
npx prisma migrate dev --name init
node ./modules/db/seeder.js
npm start
