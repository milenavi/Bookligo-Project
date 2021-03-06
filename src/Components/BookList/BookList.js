import React, {Component} from "react";
import "./BookList.css";
import {Link} from "react-router-dom";
import modelInstance from "../../data/BookligoModel";
import firebase, {auth} from "../../firebaseConfig/firebaseConfig";

class BookList extends Component {
    constructor(props) {
        super(props);
        // we put on state the properties we want to use and modify in the component
        this.state = {
            user: '',
            bookListFromDB: [],
        };
    }

    // this methods is called by React lifecycle when the
    // component is actually shown to the user (mounted to DOM)
    // that's a good place to setup model observer
    async componentDidMount() {
        modelInstance.addObserver(this);

        await auth.onAuthStateChanged((user) => {
            if (user) {
                this.setState({user, status: "LOADED",});
            }
        });

        let bookListRef = await firebase.database().ref("bookList");
        bookListRef.once('value', (snap) => {
            let booksInList = snap.val();
            let newState = [];
            for (let bookInList in booksInList) {
                newState.push({
                    id: bookInList,
                    bookId: booksInList[bookInList].bookDetails.id,
                    title: booksInList[bookInList].bookDetails.volumeInfo.title,
                    user: booksInList[bookInList].user,
                    bookSaleAbility: booksInList[bookInList].bookDetails.saleInfo.saleability,
                    bookSaleInfo: booksInList[bookInList].bookDetails.saleInfo,
                    bookImageThumbnail: booksInList[bookInList].bookDetails.volumeInfo.imageLinks.thumbnail,
                    bookImageLinks: booksInList[bookInList].bookDetails.volumeInfo.imageLinks,
                    bookPublishedDate: booksInList[bookInList].bookDetails.volumeInfo.publishedDate,
                    bookAverageRating: booksInList[bookInList].bookDetails.volumeInfo.averageRating,
                    bookAuthors: booksInList[bookInList].bookDetails.volumeInfo.authors,
                });
            }
            this.setState({
                bookListFromDB: newState
            });
        });
    }

    // this is called when component is removed from the DOM
    // good place to remove observer
    componentWillUnmount() {
        modelInstance.removeObserver(this);
    }

    // in our update function we modify the state which will
    // cause the component to re-render
    update() {
        this.setState({
        });
    }

    removeItem(bookId) {
        const bookListRef = firebase.database().ref(`/bookList/${bookId}`);
        bookListRef.remove();

        this.componentDidMount();
    }

    render() {
        let booksContainer;
        let userDisplayName = this.state.user ? this.state.user.displayName : " ";

            booksContainer = this.state.bookListFromDB.map(book => (
                <div key={book.id}>
                    {book.user === userDisplayName ?
                        <div className={`${"flex-between-books"}`}>
                            <Link to={"/details/" + book.bookId}>
                                <img className="dish-image-bookList" alt="" src={(book.bookImageLinks === undefined) ?
                                    'https://www.google.com/search?q=no+image+available&sxsrf=ACYBGNTaLXaj1-abpcsLdskwriK-FsQ53w:1575732609760&source=lnms&tbm=isch&sa=X&ved=2ahUKEwjExNyz7aPmAhVxx4sKHfGFBKAQ_AUoAXoECAoQAw&biw=733&bih=756#imgrc=21TOqNe7IyngbM:'
                                    : `${book.bookImageThumbnail}`}/>
                            </Link>
                            <div className="book-info-wrapper">
                                <div className="book-title-wrapper">
                                    <p className="book-title-sign">Book Title:</p>
                                    <Link to={"/details/" + book.bookId}>
                                        <p style={{color: "#ff8c00"}}>{book.title}</p>
                                    </Link>
                                </div>
                                <div>
                                    <p className="book-author-sign">Author(s):</p>
                                    <div>{book.bookAuthors.map(author =>
                                            {return (<p key={Math.floor((Math.random() * 10000000))}>{author}</p>);}
                                            )}
                                    </div>
                                </div>
                                <div>
                                    <div>
                                        <p className="book-rating-sign">Average Rating:</p>
                                        <p>{book.bookAverageRating === undefined ? "0 / 5" : `${book.bookAverageRating} / 5`}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="book-date-sign">Published Date:</p>
                                    <p>{book.bookPublishedDate}</p>
                                </div>
                            </div>
                            <Link to="/bookList">
                                <p id="removeDishBtn" className="removeDishBtn"
                                   onClick={() => this.removeItem(book.id)}>
                                    <button className="removeBtn">&#x1f5d1;</button>
                                </p>
                            </Link>
                        </div>
                        : ""}
                </div>
            ));

        return (
            <div className="Sidebar">
                <div id="sidebar-dishes">{booksContainer}</div>
            </div>
        );
    }
}

export default BookList;
