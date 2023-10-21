import { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { toast } from 'react-toastify'
import Message from '../../components/Message'
import Loader from '../../components/Loader'
import { fetchUser, updateUser } from '../../slices/authSlice.js'
import { useDispatch, useSelector } from "react-redux";
import FormContainer from '../../components/FormContainer'



const UserEditScreen = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id: userId } = useParams()
    const { user, userStatus, userError, updatedUserStatus, updatedError } = useSelector((state) => state.auth)

    useEffect(() => {
        dispatch(fetchUser(userId));
    }, [dispatch, userId])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);


    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
            setIsAdmin(user.isAdmin);
        }
    }, [user])

    
    const submitHandler = async (e) => {
        e.preventDefault()
        try {
            await dispatch(updateUser({id: userId, name, email, isAdmin})).unwrap()
            if (updatedUserStatus === 'failed') {
                toast.error(updatedError)
            }
            toast.success('User Updated')
            navigate('/admin/userlist')
        } catch (err) {
            toast.error(err?.data?.message || err.error)
        }
    };
  
    return (
        <>
            <Link to="/admin/userlist" className="btn btn-light my-3">
                Go Back
            </Link>
            <FormContainer>
                <h1>Edit User</h1>
                {updatedError && <Message variant='danger'>{updatedError}</Message>}
                {updatedUserStatus === 'loading' && <Loader />}
                {userStatus === 'loading' ? <Loader /> : userError ? <Message variant='danger'>
                    {userError}</Message> : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name' className='my-2'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='email' className='my-2'>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId='isAdmin' className='my-2'>
                            <Form.Check
                                type='checkbox'
                                label='Is Admin'
                                checked={isAdmin}
                                onChange={(e)=>setIsAdmin(e.target.value)}
                            ></Form.Check>
                        </Form.Group>

                        <Button type='submit' variant='primary' className='my-2'>
                            Update
                        </Button>

                    </Form>
                )}
            </FormContainer>
        </>
    )
}

export default UserEditScreen