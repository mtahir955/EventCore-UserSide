"use client";

import Image from "next/image";

interface Host {
  id: string;
  name: string;
  email: string;
  category: string;
  address: string;
  amount: number;
  avatar: string;
}

const successfulWithdrawals: Host[] = [
  {
    id: "h1",
    name: "Daniel Carter",
    email: "info@gmail.com",
    category: "Organizer/Host",
    address: "New York, USA",
    avatar: "/avatars/avatar-1.png",
    amount: 1500,
  },
  {
    id: "h2",
    name: "Sarah Mitchell",
    email: "host@gmail.com",
    category: "Organizer/Host",
    address: "California, USA",
    avatar: "/avatars/avatar-1.png",
    amount: 2300,
  },
  {
    id: "h3",
    name: "Emily Carter",
    email: "emily@gmail.com",
    category: "Organizer/Host",
    address: "Texas, USA",
    avatar: "/avatars/avatar-1.png",
    amount: 3200,
  },
];

export function PaymentSuccessTable() {
  return (
    <div className="flex flex-col w-full gap-10">
      {/* ========================== Payment History Table ========================== */}
      <div className="flex flex-col w-full">
        {/* <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Payment History
        </h3> */}

        <div className="flex justify-center w-full">
          <div className="bg-background rounded-xl border border-border overflow-hidden overflow-x-auto w-full max-w-7xl">
            <table className="w-full text-center">
              <thead>
                <tr
                  className="border-b border-border"
                  style={{ background: "rgba(245, 237, 229, 1)" }}
                >
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Name
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Email
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Category
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Address
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-sm font-semibold dark:text-black text-foreground">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {successfulWithdrawals.map((history, index) => (
                  <tr
                    key={`${history.id}-${index}`}
                    className="border-b border-border last:border-b-0 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="pl-10 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <Image
                            src={history.avatar}
                            alt={history.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                        <span className="text-sm text-foreground font-medium">
                          {history.name}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-foreground">
                      {history.email}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {history.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {history.address}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {history.amount}
                    </td>

                    <td className="px-6 py-4">
                      <span className="rounded-full bg-green-600 text-white px-4 py-1.5 text-sm font-medium">
                        Successful
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
