import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from "react-bootstrap/Table";
import ReactPaginate from "react-paginate";

const Tablename = () => {
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [pages, setPages] = useState(0);
    const [rows, setRows] = useState(0);
    const [query, setQuery] = useState("");
    const [keyword, setKeyword] = useState("");
    const [msg, setMsg] = useState("");

    useEffect(() => {
        getUsers();
    }, [page, keyword]);

    const getUsers = async () => {
        const response = await axios.get(`http://localhost:5000/search?search_query=${keyword}&page=${page}&limit=${limit}`);
        setUsers(response.data.result);
        setPage(response.data.page);
        setPages(response.data.totalPage);
        setRows(response.data.totalRows);
    }

    const changePage = ({ selected }) => {
        setPage(selected);
        if (selected === 9) {
            setMsg("Data tidak ada, silahkan cari di pencarian!");
        } else {
            setMsg("");
        }
    };

    const searchName = (e) => {
        e.preventDefault();
        setPage(0);
        setKeyword(query);
    }

    return (
        <div className='container'>
            <form onSubmit={searchName}>
                <input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by NIP, Name, or Email" />
                <button type="submit" className="button is-info">Search</button>
            </form>
            <Table striped bordered hover size="sm" className="mt-4">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>NIP</th>
                        <th>Nama</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.nip}</td>
                            <td>{user.nama}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <p>Total Nama: {rows} | Page Ke: {rows ? page + 1 : 0} dari: {pages} page</p>
            <p className='has-text-danger'>{msg}</p>
            <nav className='pagination' role="navigation" aria-label='pagination'>
                <ReactPaginate
                    previousLabel={"<=="}
                    nextLabel={"==>"}
                    pageCount={Math.min(10, pages)}
                    onPageChange={changePage}
                    containerClassName={"pagination-list"}
                    pageLinkClassName={"pagination-link"}
                    previousLinkClassName={"pagination-previous"}
                    nextLinkClassName={"pagination-next"}
                    activeLinkClassName={"pagination-link is-current"}
                    disabledLinkClassName={"pagination-link is-disabled"}
                />
            </nav>
        </div>
    )
}

export default Tablename;
