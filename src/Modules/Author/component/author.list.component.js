import React, {useEffect, useState} from 'react';
import ReactDatatable from "@ashvin27/react-datatable";
import axios from 'axios';
import Modal from "../../Main/libraries/modal/modal";
import {useToasts} from 'react-toast-notifications';

function AuthorList() {
    const {addToast} = useToasts();
    const [authors, setAuthors] = useState([]);
    const [showEditAuthorModal, setShowEditAuthorModal] = useState(false);
    const [editAuthorInfo, setEditAuthorInfo] = useState(
        {
            _id: "",
            firstName: "",
            lastName: ""
        }
    );
    const config = {
        page_size: 10,
        length_menu: [10, 20, 50],
        show_filter: false,
        show_pagination: true,
        pagination: 'advance',
    }
    const columns = [
        {
            key: "firstName",
            text: "First Name",
            className: "name",
            sortable: true,
        },
        {
            text: 'Last Name',
            key: 'lastName',
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
        GetAuthors(page_number, page_size);
    }

    const GetAuthors = (page = 1, page_size = 10) => {

        (async function () {
            try {

                axios.get(`http://127.0.0.1:8000/authors?page=` + page + '&page_size=' + page_size)
                    .then(res => {
                        const authors = res.data.authors;
                        const filteredAuthors = authors.map((author) => {
                            return {
                                firstName: author.firstName,
                                lastName: author.lastName,
                                edit: <EditButton author_id={author._id}/>
                            }
                        });

                        setTotalRecord(res.data.count);
                        setAuthors(filteredAuthors);
                    }).catch(err => {

                });

            } catch (e) {
                console.error(e)
            } finally {

            }
        })();
    }

    const editAuthorInfoChange = (e) => {
        const {name, value} = e.target;

        setEditAuthorInfo(prevState => (
                {
                    ...prevState,
                    [name]: value
                }
            )
        );
    }

    const openEditModal = async (author_id) => {
        const result = await axios.get(`http://127.0.0.1:8000/authors/` + author_id);
        const author = result.data.author;

        setEditAuthorInfo({
            _id: author._id,
            firstName: author.firstName,
            lastName: author.lastName,
        })

        setShowEditAuthorModal(true);
    }

    const EditButton = (props) => {
        return (
            <button className="btn btn-primary" onClick={() => openEditModal(props.author_id)}>Edit</button>
        );
    }

    const editAuthor = () => {
        (async function () {
            try {

                axios.put(`http://127.0.0.1:8000/authors/` + editAuthorInfo._id, editAuthorInfo)
                    .then(res => {
                        setAuthors(GetAuthors())
                        setShowEditAuthorModal(false)
                        addToast('Author Info Updated Successfully', {appearance: 'success', autoDismiss: true});

                    }).catch(err => {
                    addToast(err.message, {appearance: 'error', autoDismiss: true});
                });

            } catch (e) {
                console.error(e)
            } finally {

            }
        })();
    }

    useEffect(() => {
        GetAuthors();
    }, [])


    return (
        <div className="main-container">
            {
                authors
                &&
                <ReactDatatable
                    config={config}
                    records={authors}
                    columns={columns}
                    dynamic={true}
                    total_record={total_record}
                    onChange={tableChangeHandler}
                />

            }
            <Modal show={showEditAuthorModal}>
                <div className='container '>

                    <h1 className='text-left'>Edit Author</h1>
                    <hr/>
                    <div className="panel-body">
                        <div className="form-group text-left">
                            <label htmlFor="firstName">First Name :</label>
                            <input type="text" className="form-control" id="firstName"
                                   placeholder="Enter First Name ..."
                                   name="firstName" value={editAuthorInfo.firstName} onChange={editAuthorInfoChange}/>
                        </div>

                        <div className="form-group text-left">
                            <label htmlFor="lastName">Last Name :</label>
                            <input type="text" className="form-control" id="lastName" placeholder="Enter Last Name ..."
                                   name="lastName" value={editAuthorInfo.lastName} onChange={editAuthorInfoChange}/>
                        </div>


                        <div className="form-group text-right">
                            <button className="btn btn-primary" onClick={editAuthor}>Edit Author</button>
                        </div>

                    </div>
                    <hr/>
                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6 pull-right'>
                            <button className='btn btn-default'
                                    onClick={() => setShowEditAuthorModal(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>
        </div>
    );
}

export default AuthorList;
