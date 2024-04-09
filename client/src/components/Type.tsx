import React from "react";

interface TypeDropDownProps {
    value: string;
    setSNewPostType: React.Dispatch<React.SetStateAction<string>>;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isOpen: boolean;
}

const Type: React.FC<TypeDropDownProps> = ({ value, setSNewPostType, setIsOpen, isOpen }) => {
    const handleValueClick = () => {
        setSNewPostType(value);
        setIsOpen(!isOpen);
    };

    return (
        <li  className={"type-dropdown-list"}   onClick={handleValueClick}>{value}</li>
    );
};

export default Type;