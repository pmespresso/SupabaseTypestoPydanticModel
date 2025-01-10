# Supabase Typescript Database Types to Pydantic Models Converter

If you are like me and love to use `npx supabase gen:types` to create the `database.types.ts` for your Typescript projects, but wish you could do the same for your Python servers, this should help you a great deal.


### How to Run Locally

#### 1. Clone Repo
```
git clone https://github.com/pmespresso/SupabaseTypestoPydanticModel/
```

#### 2. Install dependencies
```
pnpm i
```

#### 3. Run the web app
````
pnpm dev
````


### How to Use the App

#### Step 1. Generate Supabase Typescript types for Your Supabase Project
```
npx supabase gen types typescript --project-id xxxxxxxxxxxxxxx > ./src/lib/database.types.ts
```

#### Step 2. Upload the `database.types.ts`

<img width="864" alt="Screenshot 2025-01-10 at 1 49 48 PM" src="https://github.com/user-attachments/assets/b834102f-8db1-4c2d-ae93-9390fef9cb3f" />

#### Step 3. Download and Review
<img width="916" alt="Screenshot 2025-01-10 at 1 50 20 PM" src="https://github.com/user-attachments/assets/e78cbf05-699b-43f4-9460-e2cd44f575f9" />

