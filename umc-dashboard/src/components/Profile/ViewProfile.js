import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api, { baseURL } from "../api";

const ViewProfile = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setUser(response.data);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, [id]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
        window.location.href = "/";
    };

    return (
        <div className="page-wrapper">
            <div className="content">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/home">Home</Link>
                        </li>
                        <li className="breadcrumb-item active" aria-current="page">
                            View Profile
                        </li>
                    </ol>
                </nav>
                <div className="card mb-4 p-4">
                    <div className="row align-items-center">
                        <div className="col-md-4 text-center">
                            <img
                                src={user?.userImage ? `${baseURL}/${user.userImage}` : "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMwAAADACAMAAAB/Pny7AAAAMFBMVEXk5ueutLfY29ypr7Ln6ere4eK8wcPU19nq7O22u77b3t/Hy83R1NazuLvN0NK5vsDaM1loAAAE90lEQVR4nO2d25LbIAxAMYiLwZf//9viOG02jWMbkCNlR2f60N2++AwIEAiqlCAIgiAIgiAIgiAIgiAIgiAIgiAIlwMAStlolz/LD0D9QdUAWO2nlNxKStMQ7Xf6BDsk148m02XM7S+9S8PX+UDQqe82GXunv0kHgp/HbZXVZ/ZfoxP0m0b5Qa/DN+iAnc2hS44hp9jbgBq6My7LiDBQf+wBYN05lbVxLOfGAT2ed8k2nab+4vfA2S72sOHb1aYik5WJZ0+DVOHC1abOhaVNjpda2MUN+GqXrvO82gbi3lrsANMxm28K5soNG0f9+U9MLS7ZZqIWeACxzSXbRDYdDZo62U2m5yIDQ6tLthmY2ECzSmbkIRMao/9OCtQiCygNk5uG2mMBcBqGR9NAw9z/xExt0rgoe4Z+QAsOy8U4chl7vEd2lj4SuzSkMa9Q97PKXHkTk4hlLFrIZJwldQGPFzJ53qRNOVFDhjpoICFN/zeoczRcmUQaNHFGdMkrGkoZiJjxv0ybhEEDHmuVeYdWBtel079JhnKiQZ5mOuPpXERGZESmVAZ7nqEdmn+TzIkqmRJG0sOAiJlo5oUm6ZZGSXXJMYY4b0bOZ0hdoKYo470MbUkADKjDGfEZOupwRpqbLSAOZ8Qho1T4TTuaoPGChngPcAFvf4Z4llGo/Yz+HBAsVj+jXZjdbbDGM/qDM4zCmTv04a/QTjVnDi556YzRNIZFw+SmOVX8f0BPPpT9BaGqiUe7KIwaLUM/xzxoXQawqZ1baF2hUZczPNOWcTKqN73RsEQjz2NeqK9uoN6T2aL2eNOQnsq+o7KCfqTckn0LqCoZBgv/LaCi9HTke8ExFMaN6TnfpC0sP+OQj+0Aw/nG6akr/w6BmE7eb0xMQ/8noLw7oeM839D/CVjvzJ6OMW5gdjNrB7D6bWczWUVznPT3sNNsXton/2Yevs3kRo6edHtD4x9j+pJI2QRCUNYP0zQN3qrwFa8z7AEPqD+lltvjOa/kX97/8StYGsDaGHPfSsnN6ysn60AwjrNzKXc4HaNir7SIRJ0tXL8+mvMyOt9/O84pTV5bxbXvLY8ZDSnlptiQ2JptlueBJm/5+QSIw9oehxpPSksbTV4xGuWWt4xcwxF6Fso+1BYLEFTq2w/PRqeB2gfAox3Qjom0u4E6m7ucwzi6FMemwng/tjE9zZmT3c9Zqn3GvIj7qBAofY3KqjN9NEl4n3rh6MwfS0QhpqLnpar4zBYBqAnjPPaQ8QMjW9C4F7N26NO10w6EhFyVvctsL1wUBPuxZrkzXWaDfY3hBCZdNQ6g1jCftbmkCLXo6UJMmxH/GgpEGpfugkvCoHsql1tVLWZXA3/p8uXYBnEYIBjG/rPBe9uV3CWDZRMYuHQdTtxg1pS3gFFbj31LvhqMyzVEc+UW7dsDFGuYN7SWpGO8kIdG4wuVYKkFnmi7YAMfyZDPYxrKuQKjgFlpeAYRpS4elfr6Z7x32BCp3FADTf3hW7i6pgmf3r04R9XUyWGtvEVVwR3a9StsKpoG/REGNCrWAZiP/eHSl8+cyI99YVKcC+Be9Eel4u4AnzTmlcIhAPvZElRKdwVZ5TH/U/x0ILv18k8KH6lllPlvUJbWsNmS2aYsaEBzbpjSS2qetUzhigbrEfaLGIuGM9aDWaZIxhneFP2XYlHzpsRFEARBEARBoOAPhEhJogo6DqQAAAAASUVORK5CYII="}
                                alt="User Avatar"
                                className="rounded-circle img-fluid"
                                style={{ width: "150px" }}
                            />
                            <h5 className="mt-3">{user?.username || "User"}</h5>
                            <p className="text-muted">{user?.designation || "N/A"}</p>
                        </div>
                        <div className="col-md-8">
                            <div className="row">
                                <div className="col-sm-4"><strong>Full Name:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.fullname || "N/A"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Designation:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.designation || "N/A"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Email:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.email || "example@example.com"}</div>
                            </div>
                            <hr />
                            <div className="row">
                                <div className="col-sm-4"><strong>Mobile:</strong></div>
                                <div className="col-sm-8 text-muted">{user?.mobile || "912345XXXX"}</div>
                            </div>
                            <div className="mt-3 d-flex justify-content-end">
                                <Link to={`/edit-profile/${user?.id}`} className="btn btn-outline-success mx-2 btn-sm">
                                    Edit Profile
                                </Link>
                                <button className="btn btn-outline-primary mx-2 btn-sm" onClick={handleLogout}>
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ViewProfile;
