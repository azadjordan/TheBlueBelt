import { Pagination } from "react-bootstrap";
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Paginate = ({ pages, page, keyword='', isAdmin = false }) => {
    const navigate = useNavigate();

    const navigateToPage = (pageNumber) => {
        let path = '';
        if(isAdmin) {
            path = `/admin/productlist/${pageNumber}`;
        } else {
            path = keyword ? 
              `/search/${keyword}/page/${pageNumber}` : 
              `/page/${pageNumber}`;
        }
        navigate(path);
    };

    return (
        pages > 1 && (
            <Pagination>
                {[...Array(pages).keys()].map((x) => (
                    <Pagination.Item 
                        key={x + 1}
                        onClick={() => navigateToPage(x + 1)}
                        active={x + 1 === page}
                    >
                        {x + 1}
                    </Pagination.Item>
                ))}
            </Pagination>
        )
    );
};

export default Paginate;
