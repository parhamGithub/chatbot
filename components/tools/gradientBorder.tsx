export const GradientBorder = ({children, classNameP="", classNameC="", rounded="lg"}
    :
    {children: React.ReactNode, classNameP?: string, classNameC?: string, rounded?:string}
) => {
    return (
        <div
            className={`relative p-[2px] ${classNameP}`}
        >
            <div
                className={`absolute inset-0 bg-gradient-to-r
                from-red-500 via-purple-500 to-blue-500 rounded-${rounded}`}
            ></div>
            <div
                className={`relative w-full h-full bg-slate-900 rounded-${rounded} flex
                items-center justify-center ${classNameC}`}
            >
                {children}
            </div>
        </div>
    )
}