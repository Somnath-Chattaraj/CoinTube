import { useUser } from "@clerk/clerk-react";

export function UserProfile() {
    const { user } = useUser();

    if (!user) return <p>Loading...</p>;

    console.log("User Details:", user);

    return (
        <div>
            <h2>Welcome, {user.fullName}</h2>
            <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
            <img src={user.imageUrl} alt="Profile" width={80} height={80} />
        </div>
    );
}
