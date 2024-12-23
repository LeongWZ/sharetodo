/* eslint-disable react/prop-types */
import { PriorityEnum } from "../util/constants";
import { Chip } from "@mui/material";


export default function PriorityTag({ priority }) {
    return (
        <Chip label={priority} color={getPriorityColor(priority)} />
    );
}

function getPriorityColor(priority) {
    switch (priority) {
        case PriorityEnum.LOW:
            return 'success';
        case PriorityEnum.MEDIUM:
            return 'warning';
        case PriorityEnum.HIGH:
            return 'error';
        default:
            return 'info';
    }
}