import { validateRequest } from "@/auth";

export default async function Home() {
  const { user } = await validateRequest();

  return (
    <main className="container mx-auto max-w-7xl p-2">
      <h2>Welcome To Adda Baji{user?.displayName}</h2>
    </main>
  );
}
