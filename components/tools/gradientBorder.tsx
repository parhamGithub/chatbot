export const GradientBorder = ({children, classNameP="", classNameC=""}
    :
    {children: React.ReactNode, classNameP?: string, classNameC?: string}
) => {
    return (
        <div
            className={`relative w-full p-[2px] animate-border cursor-pointer ${classNameP}`}
        >
            <div
                className="absolute inset-0 bg-gradient-to-r
                from-red-500 via-purple-500 to-blue-500 rounded-lg"
            ></div>
            <div
                className={`relative w-full h-full bg-slate-900 rounded-lg flex
                items-center justify-center ${classNameC}`}
            >
                {children}
            </div>
        </div>
    )
}