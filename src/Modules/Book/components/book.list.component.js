import React, {useEffect, useState} from 'react';
import ReactDatatable from "@ashvin27/react-datatable";
import axios from "axios";
import Modal from "../../Main/libraries/modal/modal";
import {useToasts} from 'react-toast-notifications';

function BookList() {
    const {addToast} = useToasts();
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);

    const [selectedBook, setSelectedBook] = useState(
        {
            name: "",
            isbn: "",
            author: [{
                firstName: "",
                lastName: ""
            }]
        }
    );
    const [editBookInfo, setEditBookInfo] = useState(
        {
            _id: "",
            name: "",
            isbn: "",
            author_id: ""
        }
    );

    const [showEditBookModal, setShowEditBookModal] = useState(false);
    const [showBookDetailModal, setShowBookDetailModal] = useState(false);

    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',

    }
    const columns = [
        {
            key: "name",
            text: "Name",
            className: "",
            sortable: true,
        },
        {
            text: 'Edit',
            key: 'edit',
        },
    ];
    const [total_record, setTotalRecord] = useState(0);
    const tableChangeHandler = (e) => {
        const {page_number, page_size} = e;
        GetBooks(page_number, page_size);
    }



    const openEditModal = async (book_id) => {

        const result = await axios.get(`http://127.0.0.1:8000/books/` + book_id);
        const authors = await GetAuthors();
        const filteredAuthors = authors.map((author) => {
            return <option value={author._id}>{author.firstName + ' ' + author.lastName}</option>;
        })

        setAuthors(filteredAuthors);
        const book = result.data.book[0];

        setEditBookInfo({
            _id: book._id,
            name: book.name,
            isbn: book.isbn,
            author_id: book.author_id
        })

        setShowEditBookModal(true)


    }


    const editBookInfoChange = (e) => {
        const {name, value} = e.target;

        setEditBookInfo(prevState => (
                {
                    ...prevState,
                    [name]: value
                }
            )
        );
    }


    const editBook = () => {
        (async function () {
            try {

                axios.put(`http://127.0.0.1:8000/books/` + editBookInfo._id, editBookInfo)
                    .then(res => {
                        const book = res.data
                        setBooks(GetBooks())
                        setShowEditBookModal(false);
                        addToast('Book Info Updated Successfully', {appearance: 'success', autoDismiss: true});

                    }).catch(err => {
                    addToast(err.message, {appearance: 'error', autoDismiss: true});

                });

            } catch (e) {
                console.error(e)
            } finally {

            }
        })();
    }

    const GetBooks = (page = 1, page_size = 10) => {

        (async function () {
            try {

                axios.get(`http://127.0.0.1:8000/books?page=` + page + '&page_size=' + page_size)
                    .then(res => {
                        const books = res.data.books;
                        const filteredBooks = books.map((book) => {
                            return {
                                name: <span className="clickable" id={book._id}>{book.name}</span>,
                                edit: <EditButton author_id={book.author_id} book_id={book._id}/>
                            }
                        })

                        setTotalRecord(res.data.count);
                        setBooks(filteredBooks);
                    }).catch(err => {

                });

            } catch (e) {
                console.error(e)
            } finally {

            }
        })();
    }

    const GetAuthors = async () => {
        const authors = await axios.get(`http://127.0.0.1:8000/authors`);
        return authors.data.authors;
    }

    const EditButton = (props) => {
        return (
            <button className="btn btn-primary" id={props.author_id}
                    onClick={() => openEditModal(props.book_id)}>Edit</button>
        );
    }

    const showBookDetails = async (e) => {
        const cell = e.target.className;
        if (cell.indexOf('btn') == -1) {
            const _id = e.target.id;
            const result = await axios.get(`http://127.0.0.1:8000/books/` + _id);
            const book = result.data.book[0];
            setSelectedBook(book)
            setShowBookDetailModal(true);
        }
    }

    useEffect(() => {
        GetBooks();
    }, [])

    return (
        <div className="main-container">

            {
                books
                &&
                <ReactDatatable
                    config={config}
                    records={books}
                    columns={columns}
                    dynamic={true}
                    total_record={total_record}
                    onChange={tableChangeHandler}
                    onRowClicked={showBookDetails}
                />

            }

            <Modal show={showEditBookModal}>
                <div className='container'>

                    <h1 className='text-left'>Edit a book</h1>
                    <hr/>
                    <div className="panel-body">
                        <div className="form-group text-left">
                            <label htmlFor="name">Name :</label>
                            <input type="text" className="form-control" id="name" placeholder="Enter Name ..."
                                   name="name" value={editBookInfo.name} onChange={editBookInfoChange}/>
                        </div>

                        <div className="form-group text-left">
                            <label htmlFor="isbn">ISBN :</label>
                            <input type="text" className="form-control" id="isbn" placeholder="Enter ISBN ..."
                                   name="isbn" value={editBookInfo.isbn} onChange={editBookInfoChange}/>
                        </div>

                        <div className="form-group text-left">
                            <label>Authors :</label>
                            <select className="form-control" value={editBookInfo.author_id}
                                    onChange={editBookInfoChange} name="author_id" id="author_id">
                                <option>-- Select Author --</option>
                                {authors}
                            </select>
                        </div>

                        <div className="form-group text-right">
                            <button className="btn btn-primary" onClick={editBook}>Edit Book</button>
                        </div>

                    </div>
                    <hr/>
                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6 pull-right'>
                            <button className='btn btn-default'
                                    onClick={() => setShowEditBookModal(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>

            <Modal show={showBookDetailModal}>
                <div className='container '>

                    <h1 className='text-left'>Book Details</h1>
                    <hr/>
                    <div className="panel-body">
                        <p>
                            The Book name is <b>{selectedBook.name}</b> and the ISBN is <b>{selectedBook.isbn}</b>
                        </p>

                        <p>
                            <h3>Author Details</h3>
                            The Author Name
                            is <b>{selectedBook.author[0].firstName + ' ' + selectedBook.author[0].lastName}</b>
                        </p>
                    </div>
                    <hr/>
                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6 pull-right'>
                            <button className='btn btn-default'
                                    onClick={() => setShowBookDetailModal(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>

        </div>
    );
}

export default BookList;
