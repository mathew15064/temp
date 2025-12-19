Init db
first run the db init.sql in ./db folder

run 
bun prisma db pull
Pull the db into prisma 


run 

bun prisma generate
Genearte prisma db type


For dev
npm run dev

For  prod
npm run build && npm run start

migrate
bun prisma migrate dev --name update_posts_relation