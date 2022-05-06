import {useParams} from "react-router";
import React from "react";

function BlogPost() {
    let { slug } = useParams();
    return <div>Now showing post {slug}</div>;
}

export {BlogPost};
