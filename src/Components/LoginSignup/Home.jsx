import React, { useState } from 'react'
import './LoginSignup.css'
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { useNavigate } from 'react-router-dom';


const Home = () => {
    // Halaman berikutnya (misalnya, di komponen React atau fungsi terkait)
    const storedData = localStorage.getItem('dataUser');
    const userData = storedData ? JSON.parse(storedData) : null;
    const navigate = useNavigate();

    function btnHandle_DataIOM() {
        navigate('/DataIOM');

    }

    return (
        <div className="container">
            <br></br>
            <h3 style={{ color: 'black', textAlign: 'center' }}>
            DETAIL INFORMASI AFTER LOGIN SUCCESS
            </h3>
            <br></br>
            <Table
            striped
            bordered
            hover
            variant="dark"
            style={{ background: 'lightgray' }}
            >
            <thead>
                <tr>
                <th style={{ textAlign: 'center', fontSize: "25px" }} colSpan={2}>{userData.user.name}</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>Username</td>
                    <td>{userData.user.username}</td>
                </tr>
                <tr>
                    <td>Email</td>
                    <td>{userData.user.email}</td>
                </tr>
                <tr>
                    <td>PIN</td>
                    <td>{userData.user.pin}</td>
                </tr>
                <tr>
                    <td>Jenis Kelamin</td>
                    <td>{userData.user.gender}</td>
                </tr>
                <tr>
                    <td>Site</td>
                    <td>
                        {Array.isArray(userData.user.sites) ? 
                            userData.user.sites.map(site => site.name).join(', ') : 
                            userData.user.sites.name}
                    </td>
                </tr>
                <tr>
                    <td>Divisi</td>
                    <td>{userData.user.division}</td>
                </tr>
                <tr>
                    <td>Department</td>
                    <td>{userData.user.department.name}</td>
                </tr>
                <tr>
                    <td>Sub Department</td>
                    <td>{Array.isArray(userData.user.sub_departments) ? 
                            userData.user.sub_departments.map(sub_departments => sub_departments.name).join(', ') : 
                            userData.user.sub_departments.name}
                    </td>
                </tr>
            </tbody>
            </Table>

            <div>
                <Button variant='primary' onClick={btnHandle_DataIOM}>Open Data IOM</Button>
            </div>

        </div>
    )
}

export default Home