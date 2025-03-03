import { redirect } from 'next/navigation';
import { getUserSession } from '@/lib/auth';
import db from '@/lib/db';
import { getAppointmentsByUser } from '@/lib/db/appointments';
import { format } from 'date-fns';
import AppointmentActions from './appointment-actions';
import { revalidatePath } from 'next/cache';
import { Navbar } from '@/components/navbar';

export default async function AppointmentsPage() {
  const userId = await getUserSession();
  if (!userId) {
    redirect('/auth/login');
  }

  const currentUser = db
    .prepare('SELECT id, email, role FROM users WHERE id = ?')
    .get(userId) as { id: number; email: string; role: 'patient' | 'practitioner' } | undefined;

  if (!currentUser) {
    redirect('/auth/login');
  }

  const appointments = getAppointmentsByUser(userId);

  return (
    <>
      <Navbar userEmail={currentUser.email} userRole={currentUser.role} />
      <main className="min-h-screen max-w-4xl mx-auto p-4 mt-20">
        <h1 className="text-2xl font-bold text-[#F8FAFC] mb-6">My Appointments</h1>

      {appointments.length === 0 ? (
        <div className="text-center py-8 text-[#94A3B8] bg-[#1E293B] rounded-lg">
          No appointments found
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const isPractitioner = currentUser.role === 'practitioner';
            const otherUser = isPractitioner
              ? appointment.patient!
              : appointment.practitioner!;

            return (
              <div
                key={appointment.id}
                className="bg-[#1E293B] p-4 rounded-lg shadow-lg border border-[#334155]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#F8FAFC] font-semibold">
                      {isPractitioner ? 'Patient' : 'Practitioner'}: {otherUser.name}
                    </p>
                    <p className="text-[#94A3B8]">@{otherUser.username}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#F8FAFC]">
                      {format(new Date(appointment.date), 'MMMM d, yyyy')}
                    </p>
                    <p className="text-[#94A3B8]">{appointment.time_slot}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      appointment.status === 'pending'
                        ? 'bg-[#422006] text-[#F97316]'
                        : appointment.status === 'confirmed'
                        ? 'bg-[#042F2E] text-[#2DD4BF]'
                        : 'bg-[#4C0519] text-[#F43F5E]'
                    }`}
                  >
                    {appointment.status.charAt(0).toUpperCase() +
                      appointment.status.slice(1)}
                  </span>
                  {appointment.status === 'pending' && isPractitioner && (
                    <AppointmentActions
                      appointmentId={appointment.id}
                      onStatusUpdate={async () => {
                        'use server';
                        revalidatePath('/appointments');
                      }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
      </main>
    </>
  );
}
