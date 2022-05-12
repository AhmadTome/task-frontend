import React, { useState } from 'react';
import Tabs from '../libraries/tab/tabs';
import BookContainer from "../../Book/containers/book.container";
import AuthorContainer from "../../Author/containers/author.container";


const data = [
    {
        heading: "Books",
        body: <BookContainer/>
    },
    {
        heading: "Authors",
        body: <AuthorContainer/>
    }
];
function MainContainer() {


    return (
        <div className="main-container">

            <Tabs data={data} />
        </div>
    );
}

export default MainContainer;
