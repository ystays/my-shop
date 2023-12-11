import React from 'react';
import { useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import { useGetOrderDetailsQuery, useCreateOrderMutation, useGetPayPalClientIdQuery, usePayOrderMutation } from "../slices/ordersApiSlice";
import { PayPalButtons, SCRIPT_LOADING_STATE, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';

// const OrderScreen = () => {
//   return (
//     <div>OrderScreen</div>
//   )
// }

const OrderScreen = () => {
    const { id: orderId } = useParams();

    const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);

    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    const [{ isPending }, payPalDispatch] = usePayPalScriptReducer();

    const { data: paypal, isLoading: loadingPayPal, error: errorPayPal} = useGetPayPalClientIdQuery("");

    const { userInfo } = useSelector((state: any) => state.auth);

    
    useEffect(() => {
        if (!errorPayPal && !loadingPayPal && paypal.clientId) {
            const loadPayPalScript = async () => {
                payPalDispatch({
                    type: 'resetOptions',
                    value: {
                        'clientId': paypal.clientId,
                        currency: 'USD',
                    }
                });
                payPalDispatch({ type: 'setLoadingStatus', value: SCRIPT_LOADING_STATE.PENDING });
            }
            if (order && !order.isPaid) {
                if (!window.paypal) {
                    loadPayPalScript();
                }
            }
        }
    }, [order, paypal, payPalDispatch, loadingPayPal, errorPayPal])
    
    function onApprove(data: any, actions: any) {
        return actions.order.capture().then(async function (details: any) {
            try {
                await payOrder({orderId, details});
                refetch();
                toast.success("Payment successful");
            } catch (error: any) {
                toast.error(error?.data?.message || error.message)
            }
         });
    }

    // async function onApproveTest() {
    //     await payOrder({ orderId, details: { payer: {} } });
    //     refetch();
    //     toast.success("Payment successful")
    // }

    function onError(err: any) {
        toast.error(err.message);
    }

    function createOrder(data: any, actions: any) {
        return actions.order.create({
            purchase_units: [
                {
                    amount:{ 
                        value: order.totalPrice,
                    },
                },
            ],
        }).then((orderId: string) => {
            return orderId;
        })
    }

    return isLoading ? (
        <Loader />
    ) : error ? (
    <Message variant="danger">{error ? `${error}` : ""}</Message>
    ) : (
        <>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p>
                                <strong>Name: </strong> {order.user.name}
                            </p>
                            <p>
                                <strong>Email: </strong> {order.user.email}
                            </p>
                            <p>
                                <strong>Address: </strong> {order.shippingAddress.address}, {order.shippingAddress.city}{' '}{order.shippingAddress.postalCode},{' '}{order.shippingAddress.country}
                            </p>
                            { order.isDelivered ? (
                                <Message variant="success">
                                    {`Delivered on ${order.deliveredAt}`}
                                </Message>
                            ) : (
                                <Message variant="danger">Not Delivered</Message>
                            ) }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            { order.isPaid ? (
                                <Message variant="success">
                                {`Paid on ${order.paidAt}`}</Message>
                            ) : (
                                <Message variant="danger">Not Paid</Message>
                            )}
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            { order.orderItems.map((item: any, index: any) => (
                                <ListGroup.Item key={index}>
                                    <Row>
                                        <Col md={1}>
                                            <Image src={item.image} alt={item.name} fluid rounded />
                                        </Col>
                                        <Col>
                                            <Link to={`/product/${item.product}`}>
                                                {item.name}
                                            </Link>
                                        </Col>
                                        <Col md={4}>
                                            {item.qty} x ${item.price} = ${item.qty * item.price}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <h2>Order Summary</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items</Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Shipping</Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>

                                <Row>
                                    <Col>Tax</Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>


                                <Row>
                                    <Col>Total</Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>
                            {/* PAY ORDER PLACEHOLDER */}
                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader />}
                                    {isPending ? <Loader /> : (
                                        <div>
                                            {/* <Button onClick={onApproveTest} style={{ marginBottom: '10px' }}>Test Pay Orders</Button> */}
                                            <div>
                                            <PayPalButtons createOrder={createOrder} onApprove={onApprove} onError={onError}></PayPalButtons>
                                            </div>
                                        </div>
                                    )}
                                </ListGroup.Item>
                            )}
                            {/* MARK AS DELIVERED PLACEHOLDER */}
                        </ListGroup>
                    </Card>
                </Col>
            </Row>
        </>
    );
}; 

export default OrderScreen