export default function Label({children, className, ...props}) {
    const labelClass = `text-white text-sm font-medium ${className}`;
    return (
    <label className={labelClass} {...props}>{children}</label>
 )
}