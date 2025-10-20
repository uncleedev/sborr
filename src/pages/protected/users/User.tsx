import { Card } from "@/components/ui/card";
import Searchbar from "@/components/shared/searchbar";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import TableUser from "./table";
import { useUser } from "@/hooks/useUser";
import AddUser from "./add";
import InviteUser from "./invite";

export default function UserPage() {
  const [search, setSearch] = useState("");
  const [selectedRole, setSelectedRole] = useState("all");

  const { users, loading, loggedOnUser } = useUser();

  const filteredUsers = useMemo(() => {
    return users
      .filter((user) => user.id !== loggedOnUser?.id)
      .filter((user) => {
        const matchesSearch =
          user.firstname.toLowerCase().includes(search.toLowerCase()) ||
          user.lastname.toLowerCase().includes(search.toLowerCase()) ||
          user.email.toLowerCase().includes(search.toLowerCase()) ||
          user.role.toLowerCase().includes(search.toLowerCase());

        const matchesRole =
          selectedRole === "all" || user.role === selectedRole;

        return matchesSearch && matchesRole;
      });
  }, [users, loggedOnUser, search, selectedRole]);

  return (
    <section className="flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <div>
          <h3>User Management</h3>
          <p>Manage user accounts and roles.</p>
        </div>

        <div className="flex items-center gap-4">
          <InviteUser />
          <AddUser />
        </div>
      </header>

      <Card className="p-4 flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 w-full lg:place-self-end lg:w-1/2 items-stretch sm:items-center">
          <Searchbar value={search} onChange={setSearch} />

          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="mayor">Mayor</SelectItem>
                <SelectItem value="vice_mayor">Vice Mayor</SelectItem>
                <SelectItem value="councilor">Councilor</SelectItem>
                <SelectItem value="secretary">Secretary</SelectItem>
                <SelectItem value="others">Others</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <TableUser data={filteredUsers} loading={loading} />
      </Card>
    </section>
  );
}
