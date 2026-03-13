package com.desi.bazar.util.mapper;

import org.springframework.beans.BeanUtils;

public class MapperHelper {

    public static<T,S> T mapObject(S source, Class<T> targetClass) {
        try{
            T target = targetClass.getDeclaredConstructor().newInstance();
            BeanUtils.copyProperties(source, target); // Copies matching fields
            return target;
        }catch (Exception e) {
            throw new RuntimeException("Mapping failed", e);
        }
    }
}
