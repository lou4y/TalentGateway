package com.cloudcrafters.userservice.services;

import com.cloudcrafters.userservice.entity.UserVerif;

public interface UserVerifService {
   public UserVerif addUserVerif(UserVerif userVerif);
    public UserVerif updateUserVerif(UserVerif userVerif);
    public void deleteUserVerif(String UserID);
    public UserVerif getUserVerif(String UserID);
}
