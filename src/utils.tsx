import React from "react";

export function placeholder(value?: string) {
    if (value === undefined) {
        return <span className="placeholder"/>
    } else {
        return value;
    }
}