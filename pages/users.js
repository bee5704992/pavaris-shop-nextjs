import Head from 'next/head'
import {useContext} from 'react'
import {DataContext} from '../store/GlobalState'
import Link from 'next/link'

const Users = () => {
    const {state, dispatch} = useContext(DataContext)
    const {users, auth, modal} = state

    return(
        <div className="table-responsive">
            <Head>
                <title>Users page</title>
            </Head>

            <table className="table w-100">
                <thead>
                    <tr>
                        <th></th>
                        <th>ID</th>
                        <th>Avatar</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map((user, index) => (
                            <tr key={user._id} style={{cursor: 'pointer'}}>
                                <th>{index + 1}</th>
                                <th>{user._id}</th>
                                <th>
                                    <img src={user.avatar} alt='avatar image'
                                    style={{
                                        width: '30px', height: '30px',
                                        overflow: 'hidden', objectFit: 'cover'
                                    }} />
                                </th>
                                <th>{user.name}</th>
                                <th>{user.email}</th>
                                <th>
                                    {
                                        user.role === 'admin'
                                        ? user.root ? <i className="fas fa-check text-success">Root</i>
                                                    : <i className="fas fa-check text-success"></i>
                                        : <i className="fas fa-times text-danger"></i>
                                    }
                                </th>
                                <th>
                                    {
                                        auth.user.root && auth.user.email !== user.email
                                        ? <Link href={`edit_user/${user._id}`}>
                                            <a><i className="fas fa-edit text-info mr-2" title="Edit"></i></a>
                                        </Link>
                                        : null
                                    }

                                    {
                                        auth.user.root && auth.user.email !== user.email
                                        ? <i className="fas fa-trash-alt text-danger ml-2" title="Remove"
                                        data-toggle="modal" data-target="#exampleModal"
                                        onClick={() => dispatch({
                                            type: 'ADD_MODAL',
                                            payload: [{
                                                type: 'ADD_USERS', data: users, id: user._id, 
                                                bodytext: 'Do you want to delete this user?', 
                                                title: user.email
                                            }]
                                        })}></i>
                                        : null
                                    }
                                </th>
                            </tr>
                        ))                    
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Users