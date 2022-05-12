import React, {useState} from 'react';
import axios from 'axios';
import Modal from "../../Main/libraries/modal/modal";
import AuthorList from "../component/author.list.component";
import {useToasts} from 'react-toast-notifications';

function AuthorCreate() {
    const {addToast} = useToasts();
    const [authors, setAuthors] = useState([]);
    const [showAuthorModal, setShowAuthorModal] = useState(false);
    const [authorInfo, setAuthorInfo] = useState(
        {
            firstName: "",
            lastName: "",
        }
    );
    const [authorErrInfo, setAuthorErrInfo] = useState({
            firstName: "",
            lastName: "",
        }
    );

    const authorInfoChange = (e) => {
        const {name, value} = e.target;

        setAuthorInfo(prevState => (
                {
                    ...prevState,
                    [name]: value
                }
            )
        );
    }

    const addAuthor = () => {
        resetError();

        const valid = validateInputs();
        if (!valid) return false;

        (async function () {
            try {
                axios.post(`http://127.0.0.1:8000/authors`, authorInfo)
                    .then(res => {
                        const author = res.data.author;
                        setAuthors([...authors,
                            {
                                firstName: author.firstName,
                                lastName: author.lastName,
                                edit: <button className="btn btn-primary">Edit</button>
                            }
                        ]);

                        setShowAuthorModal(false);
                        addToast('Author Added Successfully', {appearance: 'success', autoDismiss: true});

                    }).catch(err => {
                    addToast(err.message, {appearance: 'error', autoDismiss: true});
                });
            } catch (e) {
                console.error(e)
            } finally {

            }
        })();
    }

    const validateInputs = () => {
        let flag = true;
        if (authorInfo.firstName == "") {
            setAuthorErrInfo(prevState => (
                    {
                        ...prevState,
                        firstName: "The First Name is required."
                    }
                )
            );
            flag = false;
        }
        if (authorInfo.lastName == "") {
            setAuthorErrInfo(prevState => (
                    {
                        ...prevState,
                        lastName: "The Last Name is required."
                    }
                )
            );
            flag = false;

        }

        return flag;

    }
    const resetError = () => {
        setAuthorErrInfo({
            firstName: "",
            lastName: "",
        });
    }

    return (
        <div className="main-container">
            <div className='panel panel-default'>
                <div className="panel-heading">
                    Authors
                    <span className="pull-right">
                        <button className="btn btn-primary add-button" onClick={() => setShowAuthorModal(true)}>Add New Author</button>
                    </span>
                </div>
                <div className="panel-body">

                    <AuthorList/>

                </div>
            </div>

            <Modal show={showAuthorModal}>
                <div className='container '>

                    <h1 className='text-left'>Add Author</h1>
                    <hr/>
                    <div className="panel-body">
                        <div className="form-group text-left">
                            <label htmlFor="firstName">First Name :</label>
                            <input type="text" className="form-control" id="firstName"
                                   placeholder="Enter First Name ..."
                                   name="firstName" value={authorInfo.firstName} onChange={authorInfoChange}/>
                            <span style={{float: 'left', color: 'red'}}>{authorErrInfo.firstName}</span>
                        </div>
                        <br/>
                        <div className="form-group text-left">
                            <label htmlFor="lastName">Last Name :</label>
                            <input type="text" className="form-control" id="lastName" placeholder="Enter Last Name ..."
                                   name="lastName" value={authorInfo.lastName} onChange={authorInfoChange}/>
                            <span style={{float: 'left', color: 'red'}}>{authorErrInfo.lastName}</span>

                        </div>


                        <div className="form-group text-right">
                            <button className="btn btn-primary" onClick={addAuthor}>Add Author</button>
                        </div>

                    </div>
                    <hr/>
                    <div className="row form-group">
                        <div className='col-sm-2 col-sm-offset-6 pull-right'>
                            <button className='btn btn-default'
                                    onClick={() => setShowAuthorModal(false)}> Cancel
                            </button>
                        </div>
                    </div>

                </div>
            </Modal>

        </div>
    );
}

export default AuthorCreate;
