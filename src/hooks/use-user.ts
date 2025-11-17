import { useSession } from "@/hooks/use-session";

// Este hook ahora depende del estado de sesión mock.
export const useUser = () => {
    const { session } = useSession();
    const isLoading = session.status === "checking";
    const user = session.status === "authenticated" ? session.user : null;

    return { user, isLoading };
};
