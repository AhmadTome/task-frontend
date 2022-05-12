import React, {useState} from 'react';
import axios from "axios";
import Modal from "../../Main/libraries/modal/modal";
import BookList from "../components/book.list.component";
import {useToasts} from 'react-toast-notifications';

function BookCreate() {
    const {addToast} = useToasts();
    const [books, setBooks] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [bookInfo, setBookInfo] = useState(
        {
            name: "",
            isbn: "",
            author_id: ""
        }
    );

    const [bookErrInfo, setBookErrInfo] = useState({
            name: "",
            isbn: "",
            author_id: ""
        }
    );

    const [showBookModal, setShowBookModal] = useState(false);

    const openAddBookModal = async () => {

        setBookInfo({
            name: "",
            isbn: "",
            author_id: ""
        });

        const authors = await GetAuthors();
        const filteredAuthors = authors.map((author) => {
            return <option value={author._id}>{author.firstName + ' ' + author.lastName}</option>;
        })

        setAuthors(filteredAuthors);
        setShowBookModal(true)
    }

    const bookInfoChange = (e) => {
        const {name, value} = e.target;

        setBookInfo(prevState => (
                {
                    ...prevState,
                    [name]: value
                }
            )
        );
    }

    const addBook = () => {

        resetError();
        const valid = validateInputs();
        if (!valid) return false;

        (async function () {
            try {

                axios.post(`http://127.0.0.1:8000/books`, bookInfo)
                    .then(res => {
                        const book = res.data.book[0];
                        setBooks([...books,
                            {
                                name: <span className="clickable" id={book._id}>{book.name}</span>,
                                edit: <button className="btn btn-primary" id={book.author_id}>Edit</button>
                            }
                        ]);
                        setShowBookModal(false)
                        addToast('Book Added Successfully', {appearance: 'success', autoDismiss: true});

                    }).catch(err => {
                    addToast(err.message, {appearance: 'error', autoDismiss: true});

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


    const validateInputs = () => {
        let flag = true;
        if (bookInfo.name == "") {
            setBookErrInfo(prevState => (
                    {
                        ...prevState,
                        name: "The Name is required."
                    }
                )
            );
            flag = false;
        }
        if (bookInfo.isbn == "") {
            setBookErrInfo(prevState => (
                    {
                        ...prevState,
                        isbn: "The ISBN Number is required."
                    }
                )
            );
            flag = false;
        }

        if (bookInfo.author_id == "") {
            setBookErrInfo(prevState => (
                    {
                        ...prevState,
                        author_id: "The Author is required."
                    }
                )
            );
            flag = false;
        }

        return flag;

    }
    const resetError = () => {
        setBookErrInfo({
            name: "",
            isbn: "",
            author_id: ""
        });
    }


    return (
        <div className="main-container">
            <div className='panel panel-default'>
                <div className="panel-heading">
                    Books
                    <span className="pull-right">
                        <button className="btn btn-primary add-button" onClick={openAddBookModal}>Add New Book</button>
                    </span>
                </div>
                <div className="panel-body">
                    <BookList/>
                </div>
            </div>

            <Modal show={showBookModal}>
                <div className='container '>

                    <h1 className='text-left'>Add a book</h1>
                    <hr/>
                    <div className="panel-body">
                        <div className="form-group text-left">
                            <label htmlFor="name">Name :</label>
                            <input type="text" className="form-control" id="name" placeholder="Enter Name ..."
                                   name="name" value={bookInfo.name} onChange={bookInfoChange}/>
                            <span style={{float: 'left', color: 'red'}}>{bookErrInfo.name}</span>

                        </div>
                        <br/>

                        <div className="form-group text-left">
                            <label htmlFor="isbn">ISBN :</label>
                            <input type="text" className="form-control" id="isbn" placeholder="Enter ISBN ..."
                                   name="isbn" value={bookInfo.isbn} onChange={bookInfoChange}/>
                            <span style={{float: 'left', color: 'red'}}>{bookErrInfo.isbn}</span>

                        </div>
                        <br/>
                        <div className="form-group text-left">
                            <label>Authors :</label>
                            <select className="form-control" value={bookInfo.author_id} onChange={bookInfoChange}
                                    name="author_id" id="author_id">
                                <option>-- Select Author --</option>
                                {authors}
                            </select>
                            <span style={{float: 'left', color: 'red'}}>{bookErrInfo.author_id}</span>

                        </div>

                        <div className="form-group text-right">
                            <button className="btn btn-primary" onClick={addBook}>Add Book</button>
                        </div>

                    </div>

                    <hr/>

                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6 pull-right'>
                            <button className='btn btn-default'
                                    onClick={() => setShowBookModal(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>

        </div>
    );
}

export default BookCreate;
