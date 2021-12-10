import {useContext} from 'react'
import { DataContext } from '../store/GlobalState'
import { deleteItem } from '../store/Actions'
import { deleteData } from '../utils/fetchData'
import {useRouter} from 'next/router'

const Modal = () => {
    const {state, dispatch} = useContext(DataContext)
    const {modal, auth} = state

    const router = useRouter()

    const handleSubmit = () => {
        if(modal.length !== 0){
            for(const item of modal){
                
                if(item.type === 'ADD_USERS'){
                    deleteData(`user/${item.id}`, auth.token)
                    .then(res => {
                        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        
                        dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    })
                }
        
                if(item.type === 'ADD_CATEGORIES'){
                    deleteData(`categories/${item.id}`, auth.token)
                    .then(res => {
                        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
        
                        dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    })
                }
        
                if(item.type === 'DELETE_PRODUCT'){
                    deleteData(`product/${item.id}`, auth.token)
                    .then(res => {
                        if(res.err) return dispatch({type: 'NOTIFY', payload: {error: res.err}})
                        
                        router.reload()
                        dispatch({type: 'NOTIFY', payload: {success: res.msg}})
                    })
                }
        
                if(item.type !== 'DELETE_PRODUCT'){     //ถ้าเป็นtypeที่ไม่ใช่DELETE_PRODUCTจะลบไอเทมในdataContext
                    dispatch(deleteItem(item.data, item.id, item.type))
                }
                dispatch({type: 'ADD_MODAL', payload: []})
            }
        }
    }

    return (
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title text-capitalize" id="exampleModalLabel">
                            {modal.length !== 0 && modal[0].title}
                        </h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {modal.length !== 0 && modal[0].bodytext}
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-dismiss="modal" onClick={handleSubmit}>OK</button>
                        <button type="button" className="btn btn-primary" data-dismiss="modal">Cancel</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Modal