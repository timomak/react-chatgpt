import { ReactElement } from "react";


interface PageWrapperProps {
    children?: ReactElement[] | null | ReactElement;
}


export function PageWrapper({
    children
}: PageWrapperProps) {
    return (
        <div className="page-wrapper">
            {children}
        </div>
    )
}