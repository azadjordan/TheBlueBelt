import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchAllUsers, deleteUser } from '../../slices/authSlice'
import { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Table, Button } from 'react-bootstrap';
import { FaTimes, FaTrash, FaEdit, FaCheck } from 'react-icons/fa';
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify';



const UserListScreen = () => {
    const dispatch = useDispatch()

    const { userInfo } = useSelector((state) => state.auth)

    useEffect(() => {
        if (userInfo) {
            dispatch(fetchAllUsers())
        }
    }, [dispatch, userInfo])

    const deleteHandler = async(id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            try {
                await dispatch(deleteUser(id)).unwrap()
                toast.success('User Deleted')
            } catch (err) {
                toast.error(err?.data?.message || err.error)
            }
        }
      };

    const { users, usersStatus, error, deleteUserStatus, deleteError } = useSelector((state) => state.auth)

    return (
        <>
            <h1>Users</h1>
            {deleteError && <Message>{deleteError}</Message>}
            {deleteUserStatus === 'loading' && <Loader/>}
            {usersStatus === 'loading' ? (<Loader />) : error ? (<Message>{error}</Message>) : (
                <Table striped hover bordered responsive className='table-sm'>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>ADMIN</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users?.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
                                <td>
                                    {user.isAdmin ? (
                                        <FaCheck style={{ color: 'green' }} />
                                    ) : (
                                        <FaTimes style={{ color: 'red' }} />
                                    )}
                                </td>

                                <td>
                                    <Button variant='light' className='btn-sm' as={Link} to={`/admin/user/${user._id}/edit`}>
                                        <FaEdit />
                                    </Button>
                                    <Button variant="danger" className="btn-sm" onClick={() => deleteHandler(user._id)}>
                                        <FaTrash />
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </>

    )
}

export default UserListScreen