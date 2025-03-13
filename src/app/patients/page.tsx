"use client";

import { useEffect, useState } from "react";
import { User } from "@/lib/db/users";
import Link from "next/link";
import { Navbar } from "@/components/navbar";

export default function PatientsPage() {
  const [patients, setPatients] = useState<Omit<User, "password" | "role">[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("/api/patients");
        if (!response.ok) throw new Error("Failed to fetch patients");
        const data = await response.json();
        setPatients(data.patients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from cookie
    const email = document.cookie
      .split("; ")
      .find(row => row.startsWith("user-email="))
      ?.split("=")[1];
    
    if (email) {
      setUserEmail(decodeURIComponent(email));
    }
  }, []);

  if (loading) {
    return (
      <>
        <Navbar userEmail={userEmail} userRole="practitioner" />
        <div className="flex items-center justify-center min-h-screen bg-[#1E293B]">
          <div className="animate-pulse text-[#94A3B8]">Loading...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar userEmail={userEmail} userRole="practitioner" />
      <main className="container mx-auto py-8 px-4 mt-20 bg-[#1E293B] min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#F8FAFC]">My Patients</h1>
      </div>
      <div className="bg-[#334155] rounded-lg shadow-lg overflow-hidden border border-[#475569]">
        <table className="min-w-full divide-y divide-[#475569]">
          <thead className="bg-[#1E293B]">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-[#94A3B8] uppercase tracking-wider">
                Username
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#475569]">
            {patients.map((patient) => (
              <tr key={patient.id} className="group">
                <td className="px-6 py-4 whitespace-nowrap transition-colors group-hover:bg-[#1E293B]">
                  <div className="flex items-center">
                    <div className="h-12 w-12 flex-shrink-0">
                      <img
                        className="h-12 w-12 rounded-full border-2 border-[#475569]"
                        src={patient.avatar_url || "/default-avatar.png"}
                        alt={patient.name || "Patient"}
                      />
                    </div>
                    <div className="ml-4">
                      <Link 
                        href={`/health-analytics/${patient.id}`}
                        className="text-sm font-medium text-[#F8FAFC] hover:text-[#F97316] transition-colors"
                      >
                        {patient.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap transition-colors group-hover:bg-[#1E293B]">
                  <div className="text-sm text-[#94A3B8]">{patient.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap transition-colors group-hover:bg-[#1E293B]">
                  <div className="text-sm text-[#94A3B8]">@{patient.username}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </main>
    </>
  );
}
