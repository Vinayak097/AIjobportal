export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
      {children}
    </div>
  )
}
