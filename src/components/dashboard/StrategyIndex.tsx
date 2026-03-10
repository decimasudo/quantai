import { useState } from "react"

export function StrategyIndex () {
    const [isActive, setIsActive] = useState(false)
    const [progress, setProgress] = useState(0)

    const startSimulation = () => {
        setIsActive(true);
        setProgress(0)
        const interval = setInterval(() => {

        })
    }

    return (
        <div className="">
            <div className=""/>
        </div>
    )
}