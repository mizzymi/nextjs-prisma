"use client";
import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const colsFromWidth = (w: number) => {
    if (w >= 1280) return 6;
    if (w >= 1024) return 5;
    if (w >= 768) return 4;
    if (w >= 640) return 3;
    return 2;
};

export default function ResponsivePageSizer({ rows = 6 }: { rows?: number }) {
    const router = useRouter();
    const pathname = usePathname();
    const sp = useSearchParams();

    useEffect(() => {
        const apply = () => {
            const cols = colsFromWidth(window.innerWidth);
            const ps = String(cols * rows);

            if (sp.get("ps") !== ps) {
                const params = new URLSearchParams(sp);

                params.set("ps", ps);
                router.replace(`${pathname}?${params.toString()}`, { scroll: false });
            }
        };
        apply();
        const onResize = () => apply();

        window.addEventListener("resize", onResize);

        return () => window.removeEventListener("resize", onResize);
        
    }, [router, pathname, sp, rows]);

    return null;
}
