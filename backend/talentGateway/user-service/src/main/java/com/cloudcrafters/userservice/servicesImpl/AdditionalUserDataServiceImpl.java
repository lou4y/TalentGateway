package com.cloudcrafters.userservice.servicesImpl;

import com.cloudcrafters.userservice.dao.AdditionalUserDataDao;
import com.cloudcrafters.userservice.entity.AdditionalUserData;
import com.cloudcrafters.userservice.services.AdditionalUserDataService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdditionalUserDataServiceImpl implements AdditionalUserDataService {
    @Resource
    private AdditionalUserDataDao additionalUserDataDao;
    @Override
    public AdditionalUserData addAdditionalUserData(AdditionalUserData additionalUserData) {
        if (additionalUserData != null) {
            return this.additionalUserDataDao.save(additionalUserData);
        } else {
            return null;
        }
    }

    @Override
    public AdditionalUserData updateAdditionalUserData(AdditionalUserData additionalUserData) {
        AdditionalUserData additionalUserData1 =  this.additionalUserDataDao.findByUserId(additionalUserData.getUserId())    ;
        if (additionalUserData1 != null) {
            additionalUserData.setId(additionalUserData1.getId());
            return this.additionalUserDataDao.save(additionalUserData);
        } else {
            return null;
        }
    }

    @Override
    public void deleteAdditionalUserData(String UserID) {
        List<AdditionalUserData> additionalUserDataList = this.additionalUserDataDao.findAll();
        for (AdditionalUserData additionalUserData : additionalUserDataList) {
            if (additionalUserData.getUserId().equals(UserID)) {
                this.additionalUserDataDao.delete(additionalUserData);
            }
        }


    }

    @Override
    public AdditionalUserData getAdditionalUserData(String UserID) {
        List<AdditionalUserData> additionalUserDataList = this.additionalUserDataDao.findAll();
        for (AdditionalUserData additionalUserData : additionalUserDataList) {
            if (additionalUserData.getUserId().equals(UserID)) {
                return additionalUserData;
            }
        }
        return null;
    }
}
