package com.cloudcrafters.userservice.servicesImpl;

import com.cloudcrafters.userservice.dao.UserVerifDao;
import com.cloudcrafters.userservice.entity.UserVerif;
import com.cloudcrafters.userservice.services.UserVerifService;
import jakarta.annotation.Resource;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserVerifServiceImpl implements UserVerifService {
    @Resource
    private UserVerifDao userVerifDao;
    @Override
    public UserVerif addUserVerif(UserVerif userVerif) {
      if (userVerif != null) {
          return this.userVerifDao.save(userVerif);
      } else {
          return null;
      }
    }

    @Override
    public UserVerif updateUserVerif(UserVerif userVerif) {
        UserVerif userVerif1 =  this.userVerifDao.findByUserId(userVerif.getUserId());
        if (userVerif1 != null) {
            userVerif.setId(userVerif1.getId());
            return this.userVerifDao.save(userVerif);
        } else {
            return null;
        }
    }

    @Override
    public void deleteUserVerif(String UserID) {
        List<UserVerif> userVerifList = this.userVerifDao.findAll();
        for (UserVerif userVerif : userVerifList) {
            if (userVerif.getUserId().equals(UserID)) {
                this.userVerifDao.delete(userVerif);
            }
        }

    }

    @Override
    public UserVerif getUserVerif(String UserID) {
        List<UserVerif> userVerifList = this.userVerifDao.findAll();
        for (UserVerif userVerif : userVerifList) {
            if (userVerif.getUserId().equals(UserID)) {
                return userVerif;
            }
        }
        return null;
    }
}
