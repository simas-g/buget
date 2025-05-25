export default function Button({ children, variant, className, ...props}) {
    const variants = {
        primaryGradient: "bg-gradient-to-r from-accent to-primary text-white hover:shadow-[0_0_20px_rgba(99,235,37,0.5)] transition-all duration-300",
        basic: "text-white border hover:bg-white hover:text-gray-700 transition-all duration-300",
    }
    const buttonClass = `cursor-pointer px-4 py-2 rounded-lg ${variants[variant]} ${className}`
    return <button className={buttonClass} {...props}>
        {children}
    </button>
}

