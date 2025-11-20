import React, { useState } from "react";
import { SearchIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import "../../styles/serachBar.scss";

const GlobalSearchSection = ({ onQueryChange }) => {
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        onQueryChange(data.search);
        console.log(data);
    }
    return (
        <div className="searchBar-container">
            <div id="serchBar-main">
                <div id="searchBarInput-container">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <input type="text" placeholder="Search..." {...register("search")} />

                        <div id="searchButton-container">
                            <button id="searchBtn" type="submit"><SearchIcon /></button>
                        </div>
                    </form>
                </div>

            </div>

        </div >
    );
}

export default GlobalSearchSection;