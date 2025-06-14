import Navigation from "@/components/UI/Nav";

export default function DashboardLayout({children}) {
    const navLinks = [
        { href: "/nustatymai", label: "Paskyros nustatymai"},
        { href: "/"}
    ]
    return(
        <>
        {/* <Navigation navLinks={navLinks}/> */}
        {children}
        </>
    )
}