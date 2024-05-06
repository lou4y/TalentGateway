package com.cloudcrafters.userservice.services;
import com.cloudcrafters.userservice.entity.AdditionalUserData;

import java.util.List;

public interface AdditionalUserDataService {
   public AdditionalUserData addAdditionalUserData(AdditionalUserData additionalUserData);
    public AdditionalUserData updateAdditionalUserData(AdditionalUserData additionalUserData);
    public void deleteAdditionalUserData(String UserID);
    public AdditionalUserData getAdditionalUserData(String UserID);
    public List<AdditionalUserData> getAllAdditionalUserData();




}
