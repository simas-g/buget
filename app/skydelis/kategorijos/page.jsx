import { getFullUser } from "@/app/lib/auth/currentUser";
import CategoryPage from "./CategoryPage";
import { cookies } from "next/headers";
import QueryWrapper from "@/app/lib/QueryWrapper"
export default async function Page() {
  const userObject = await getFullUser();
  if (!userObject) {
    notFound();
  }
  const cookieStore = await cookies();
  const sessionKey = cookieStore.get("SESSION_KEY").value;
  const { user } = userObject;
  return (
    <div className="bg-dark-backgroud min-h-screen w-full">
      <QueryWrapper>
        <CategoryPage userId={user._id} />
      </QueryWrapper>
    </div>
  );
}
